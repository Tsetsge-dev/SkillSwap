# SkillSwap

Суралцагчид мэддэг чадвараа хуваалцаж, шинэ зүйл хамтдаа сурах платформ. Frontend нь React, Vite, Tailwind CSS; backend нь FastAPI, SQLAlchemy, SQLite/PostgreSQL ашигладаг.

## Локал хөгжүүлэлт (Windows)

1. Шаардлагатай орчны тохиргоог үүсгэнэ.

   ```powershell
   Copy-Item backend/.env.example backend/.env
   ```

   Локал хөгжүүлэлтэд `APP_ENV=development` байхад болно. Нэвтрэлтийн session-ууд сервер дахин асаахад хүчингүй болохоос сэргийлж `SECRET_KEY`-г тогтвортой, нууц утгаар бөглөнө. Gemini чат хэрэгтэй бол `GEMINI_API_KEY` тохируулна; түлхүүрийг backend/.env-д хадгалж, frontend-д хэзээ ч оруулахгүй.

2. Backend болон frontend dependency суулгана.

   ```powershell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\python.exe -m pip install -r requirements.txt
   cd ..\frontend
   npm ci
   cd ..
   ```

3. Хоёр серверээ асаана.

   ```powershell
   .\start.ps1
   ```

   Вэб: `http://localhost:5173`
   API: `http://localhost:8001/docs`

Апп анх асахдаа хүснэгтүүдийг нэмэх боловч одоо байгаа өгөгдлийн санг устгахгүй. `python -m app.seed` нь хөгжүүлэлтийн түүхэн, өгөгдөл устгадаг seed тул ашиглаж болохгүй.

## Локал demo профайл

Судалгааны чадварын жишээнээс үүсгэсэн demo хэрэглэгчдийг зөвхөн хөгжүүлэлтийн орчинд гараар нэмнэ. Энэ нь өгөгдөл устгахгүй, давхар профайл нэмэхгүй, харин өмнө үүссэн хуучин локал demo имэйлийг шинэчилнэ.

```powershell
cd backend
$env:APP_ENV = 'development'
$env:DEMO_ACCOUNT_PASSWORD = 'өөрийн-12-аас-урт-локал-нууц-үг'
.\.venv\Scripts\python.exe -m app.seed_demo_profiles
```

Seeder ашиглах бол локал орчинд өөрийн `DEMO_ACCOUNT_PASSWORD`-г тохируулна. Demo имэйлүүд `swap-demo-001@example.com`–`swap-demo-006@example.com`; жишээ профайл гэдгийг дэлгэцэнд ил тод тэмдэглэнэ. Бодит судалгаанд оролцогчийн нэр, имэйл, аккаунт оруулаагүй.

## Docker

Эхлээд `backend/.env.example`-г `backend/.env` болгон хуулж, `APP_ENV=production`, санамсаргүй үүсгэсэн 32-оос урт `SECRET_KEY`, шаардлагатай `GEMINI_API_KEY` утгыг тохируулна. Production-д demo profile seeder ажиллуулахгүй. Docker нь хуучин `backend/skillswap.db` болон `backend/uploads`-г хадгалж ашиглана.

```powershell
docker compose up --build
```

Вэб: `http://localhost:3000`. Backend-ийн Docker порт нь локал төхөөрөмжид хязгаарлагдсан. Нийтийн production орчинд HTTPS reverse proxy тохируулж, зөвхөн шаардлагатай frontend портыг ил гаргана.

## Render-д байрлуулах

Render дээр нэг **Web Service** үүсгээд GitHub repository-ийн `main` branch-ийг холбоно. Runtime-ийг **Docker**, Dockerfile замыг `backend/Dockerfile`, Docker context-ийг repository-ийн үндсэн хавтас (`.`), health check замыг `/health` болгоно. Docker image frontend-ийг build хийгээд FastAPI-с нэг домэйнээр үйлчилнэ; API нь `/api`, WebSocket нь `/ws` замаар ажиллана.

Render Environment хэсэгт дараах утгуудыг тохируулна:

- `APP_ENV=production`
- `SECRET_KEY` — санамсаргүй, дор хаяж 32 тэмдэгттэй утга
- `DATABASE_URL=sqlite:////var/data/skillswap.db`
- `UPLOAD_DIR=/var/data/uploads`
- `GEMINI_API_KEY` — Gemini чат хэрэгтэй бол
- `TURN_URLS`, `TURN_SHARED_SECRET` — TURN үйлчилгээ ашиглах видео дуудлагад

SQLite болон upload файлуудыг хадгалахын тулд Render дээр `/var/data` mount path-тай persistent disk холбоно. Өмнөх service-ийн өгөгдөл тусдаа диск/өгөгдлийн санд байвал URL эсвэл disk-ийг солихын өмнө нөөцлөлт ба шилжүүлэлтийг хий; шинэ хоосон дискэнд хуучин хэрэглэгчид өөрсдөө автоматаар хуулж ирэхгүй. Browser-ийн refresh дээр `/login`, `/profile` зэрэг React route-ууд мөн frontend рүү буцна.

## Үйлчилгээний тохиргоо ба хязгаарлалт

- **Чатбот:** Gemini нь backend-д `GEMINI_API_KEY` тохируулсны дараа өргөн хүрээний асуултад хариулна. Түлхүүргүй үед зөвхөн одоогийн локал туслахын чадварт тулгуурласан fallback ашиглагдана. Латинаар бичсэн Монгол чатанд нийтлэг үгийн галигийг кирилл ойролцуулалт болгон Gemini-д эх бичвэрийн хамт өгнө.
- **Видео дуудлага:** Камер, микрофон browser-ийн зөвшөөрөл шаарддаг. `localhost` болон HTTPS дээр WebRTC ажиллана. STUN тохиргоо байгаа ч restrictive NAT, байгууллагын firewall-аар дамжих найдвартай холболтод гаднын TURN үйлчилгээ шаардлагатай; `TURN_URLS`, `TURN_SHARED_SECRET`-г backend орчинд тохируулна.
- **Нууц үг сэргээх:** Имэйл илгээх үйлчилгээний backend/config байхгүй тул одоогоор сэргээх холбоос илгээхгүй, идэвхгүй гэдгийг хэрэглэгчид үнэн зөв мэдээлнэ.
- **Өгөгдөл:** Судалгааны жишээнүүд бол demo өгөгдөл. Бодит хэрэглэгч өөрөө бүртгүүлж, өөрийн профайлыг үүсгэнэ.

## Шалгалт

```powershell
cd frontend
npm test
npm run lint
npm run build
cd ..\backend
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
```
