from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import uuid
import os
import cv2
import face_recognition
import numpy as np
from datetime import datetime
import pytz
from fastapi import Form

# === Zona waktu Indonesia ===
TIME_ZONE = pytz.timezone("Asia/Jakarta")

# === Inisialisasi FastAPI ===
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Load .env dan koneksi database ===
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URLS")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL tidak ditemukan di file .env")

FACE_DIR = "../public/uploads/employee_faces"
engine = create_engine(DATABASE_URL)
KNOWN_ENCODINGS = {}

# === Load wajah terdaftar ===
def load_known_faces():
    if not os.path.exists(FACE_DIR):
        os.makedirs(FACE_DIR)

    with engine.connect() as conn:
        result = conn.execute(text('SELECT "userId", "faceEncoding" FROM "FaceRegistration"'))
        for row in result.mappings():
            user_id = row["userId"]
            encoding_bytes = row["faceEncoding"]
            if encoding_bytes:
                try:
                    encoding_array = np.frombuffer(encoding_bytes, dtype=np.float64)
                    KNOWN_ENCODINGS[user_id] = encoding_array
                except Exception as e:
                    print(f"Gagal decode encoding untuk user {user_id}: {e}")

    print(f"{len(KNOWN_ENCODINGS)} wajah berhasil dimuat ke memori.")

load_known_faces()

# === Encode wajah dari file ===
def encode_face(image_bytes):
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return None
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encodings = face_recognition.face_encodings(img_rgb)
        return encodings[0] if encodings else None
    except Exception as e:
        print(f"Error saat encode wajah: {e}")
        return None

# === Endpoint verifikasi wajah ===
@app.post("/verify/")
async def verify_face(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        encoding = encode_face(image_bytes)

        if encoding is None:
            raise HTTPException(status_code=400, detail="Wajah tidak terdeteksi.")

        best_match_user = None
        best_match_dist = 1.0

        for user_id, known_encoding in KNOWN_ENCODINGS.items():
            dist = face_recognition.face_distance([known_encoding], encoding)[0]
            if dist < 0.5 and dist < best_match_dist:
                best_match_dist = dist
                best_match_user = user_id

        if best_match_user:
            print(f"✅ Hasil verifikasi wajah: best_match_user = {best_match_user}, distance = {best_match_dist}")

            return {
                "userId": best_match_user,
                "detail": f"Wajah user {best_match_user} terverifikasi (jarak {best_match_dist:.3f})."
            }

        raise HTTPException(status_code=403, detail="Wajah tidak dikenali atau belum diregistrasi.")

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error di endpoint /verify/: {e}")
        raise HTTPException(500, "Terjadi kesalahan saat verifikasi wajah.")

# === Endpoint ambil semua user yang terdaftar ===
@app.get("/faces/")
def get_faces():
    return {"registered": list(KNOWN_ENCODINGS.keys())}

# === Endpoint registrasi wajah ===
@app.post("/register/")
async def register_face(file: UploadFile = File(...), userId: str = Form(...)):
    image_bytes = await file.read()
    encoding = encode_face(image_bytes)
    if encoding is None:
        return JSONResponse(content={"detail": "Tidak ada wajah terdeteksi."}, status_code=400)

    filename = f"{userId}_{int(datetime.now().timestamp())}.jpg"
    save_path = os.path.join(FACE_DIR, filename)
    with open(save_path, "wb") as f:
        f.write(image_bytes)

    new_id = str(uuid.uuid4())

    with engine.begin() as conn:
        conn.execute(text("""
            INSERT INTO "FaceRegistration" ("id", "userId", "imagePath", "faceEncoding", "createdAt")
            VALUES (:id, :userId, :imagePath, :faceEncoding, NOW())
            ON CONFLICT ("userId") DO UPDATE SET 
                "imagePath" = :imagePath,
                "faceEncoding" = :faceEncoding,
                "createdAt" = NOW();
        """), {
            "id": new_id,
            "userId": userId,
            "imagePath": filename,
            "faceEncoding": encoding.tobytes()
        })

    KNOWN_ENCODINGS[userId] = encoding

    return {"detail": f"Wajah untuk {userId} berhasil diregistrasi."}

@app.post("/detect/")
async def detect_faces(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise HTTPException(status_code=400, detail="Gambar tidak valid")

        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Deteksi lokasi wajah
        face_locations = face_recognition.face_locations(rgb_img)
        face_encodings = face_recognition.face_encodings(rgb_img, face_locations)

        results = []
        for (top, right, bottom, left), encoding in zip(face_locations, face_encodings):
            best_match_user = None
            best_match_dist = 1.0

            for user_id, known_encoding in KNOWN_ENCODINGS.items():
                dist = face_recognition.face_distance([known_encoding], encoding)[0]
                if dist < 0.5 and dist < best_match_dist:
                    best_match_dist = dist
                    best_match_user = user_id

            results.append({
                "name": best_match_user or "Unknown",
                "box": {
                    "top": top,
                    "right": right,
                    "bottom": bottom,
                    "left": left
                }
            })

        return {"results": results}

    except Exception as e:
        print(f"Error di endpoint /detect/: {e}")
        raise HTTPException(500, "Terjadi kesalahan saat deteksi wajah.")
