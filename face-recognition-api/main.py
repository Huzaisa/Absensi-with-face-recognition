from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, text
import uuid
import os
import cv2
import face_recognition
import numpy as np
from datetime import datetime

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path dan DB
FACE_DIR = "../public/uploads/employee_faces"
DATABASE_URL = "postgresql://postgres:pinter12@localhost:5432/absensi"
engine = create_engine(DATABASE_URL)

# In-memory encodings
KNOWN_ENCODINGS = {}

# === Load wajah dari DB saat startup ===
def load_known_faces():
    if not os.path.exists(FACE_DIR):
        os.makedirs(FACE_DIR)

    with engine.connect() as conn:
        result = conn.execute(text('SELECT "userId", "imagePath" FROM "FaceRegistration"'))
        for row in result:
            user_id, image_path = row
            full_path = os.path.join(FACE_DIR, image_path)
            if os.path.exists(full_path):
                image = face_recognition.load_image_file(full_path)
                encodings = face_recognition.face_encodings(image)
                if encodings:
                    KNOWN_ENCODINGS[user_id] = encodings[0]

load_known_faces()

# === Encode wajah dari file ===
def encode_face(image_bytes):
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encodings = face_recognition.face_encodings(img_rgb)
        return encodings[0] if encodings else None
    except Exception as e:
        print(f"Error saat encode wajah: {e}")
        return None

# === Simpan absensi jika cocok ===
def save_attendance(user_id):
    today = datetime.now().date()
    now = datetime.now()

    with engine.begin() as conn:
        # Ambil shift user
        result = conn.execute(text("""
            SELECT "startTime" FROM "ShiftMapping"
            WHERE "userId" = :userId AND "date" = :date
        """), {"userId": user_id, "date": today}).fetchone()

        is_late = False
        status = "ONTIME"
        if result:
            shift_start = result["startTime"]
            if now.time() > shift_start:
                is_late = True
                status = "LATE"

        # Simpan absensi
        conn.execute(
            text("""
                INSERT INTO "Attendance" ("userId", "date", "clockIn", "status", "isLate")
                VALUES (:userId, :date, :clockIn, :status, :isLate)
                ON CONFLICT ("userId", "date") DO NOTHING;
            """),
            {
                "userId": user_id,
                "date": today,
                "clockIn": now,
                "status": status,
                "isLate": is_late
            }
        )

# === Register wajah ===
@app.post("/register/")
async def register_face(file: UploadFile = File(...), userId: str = Form(...)):
    image_bytes = await file.read()
    encoding = encode_face(image_bytes)
    if encoding is None:
        return JSONResponse(content={"detail": "Tidak ada wajah terdeteksi."}, status_code=400)

    # Simpan file
    filename = f"{userId}_{int(datetime.now().timestamp())}.jpg"
    save_path = os.path.join(FACE_DIR, filename)
    with open(save_path, "wb") as f:
        f.write(image_bytes)

    # Simpan metadata ke DB
    with engine.begin() as conn:
        conn.execute(
            text("""
                INSERT INTO "FaceRegistration" ("userId", "imagePath", "createdAt")
                VALUES (:userId, :imagePath, NOW())
                ON CONFLICT ("userId") DO UPDATE SET "imagePath" = :imagePath, "createdAt" = NOW();
            """),
            {"userId": userId, "imagePath": filename}
        )

    # Update in-memory encoding
    KNOWN_ENCODINGS[userId] = encoding

    return {"detail": f"Wajah untuk {userId} berhasil diregistrasi."}

# === Verifikasi wajah dari kamera atau file ===
@app.post("/verify/")
async def verify_face(file: UploadFile = File(None)):
    # Cek apakah kamera tersedia
    cam = cv2.VideoCapture(0)
    cam_available = cam.isOpened()
    cam.release()

    if cam_available:
        cam = cv2.VideoCapture(0)
        ret, frame = cam.read()
        cam.release()

        if not ret:
            raise HTTPException(status_code=400, detail="Gagal mengambil gambar dari kamera.")

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    else:
        if file is None:
            raise HTTPException(status_code=400, detail="Kamera tidak tersedia dan file tidak dikirim.")

        image_bytes = await file.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        rgb_frame = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    if not face_encodings:
        raise HTTPException(status_code=404, detail="Wajah tidak terdeteksi.")

    for encoding in face_encodings:
        for user_id, known_encoding in KNOWN_ENCODINGS.items():
            match = face_recognition.compare_faces([known_encoding], encoding, tolerance=0.5)
            if match[0]:
                save_attendance(user_id)
                return {"userId": user_id, "detail": f"Wajah user {user_id} terverifikasi."}

    raise HTTPException(status_code=403, detail="Wajah tidak dikenali atau belum diregistrasi.")

# === List user yang sudah daftar wajah ===
@app.get("/faces/")
def get_faces():
    return {"registered": list(KNOWN_ENCODINGS.keys())}
