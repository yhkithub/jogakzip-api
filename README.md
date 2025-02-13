# 조각집 API

## 워크스페이스

이 프로젝트는 다음과 같은 주요 디렉토리와 파일로 구성되어 있습니다:

- `src/` - 소스 코드 디렉토리
- `tests/` - 테스트 코드 디렉토리
- `docs/` - 문서 디렉토리
- `package.json` - 프로젝트 메타데이터 및 의존성 관리 파일
- `README.md` - 프로젝트 개요 및 사용법을 설명하는 파일

# 조각집 API

이 저장소는 조각집 게시물 API 백엔드입니다. 이 API는 그룹, 게시물, 댓글, 이미지 업로드 등의 기능을 제공합니다.

## 프로젝트 구조

```
.
├── .env
├── .gitignore
├── api/
│   └── index.js
├── generated-icon.png
├── http/
│   ├── comment.http
│   ├── group.http
│   ├── image.http
│   └── post.http
├── package.json
├── prisma/
│   ├── migrations/
│   │   └── 20250210161508_init/
│   │       └── migration_lock.toml
│   ├── schema.prisma
│   ├── seed.js
│   └── updateMoment.js
├── public/
│   └── images/
│       └── test.png
├── README.md
├── replit.nix
├── replit.toml
├── src/
│   ├── app.js
│   ├── controllers/
│   │   ├── commentController.js
│   │   ├── groupController.js
│   │   ├── imageController.js
│   │   └── postController.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── routes/
│   │   ├── badgeRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── groupRoutes.js
│   │   ├── imageRoutes.js
│   │   ├── postCommentRoutes.js
│   │   └── postRoutes.js
│   ├── services/
│   │   └── badgeService.js
│   └── utils/
│       └── hashUtils.js
├── uploads/
└── vercel.json
```

### 주요 디렉토리 및 파일 설명

- **api/**: Express 서버 설정 및 기본 엔드포인트 정의
  - `index.js`: 서버 설정 및 예제 엔드포인트 정의

- **http/**: HTTP 요청 예제 파일
  - `comment.http`: 댓글 관련 HTTP 요청 예제
  - `group.http`: 그룹 관련 HTTP 요청 예제
  - `image.http`: 이미지 업로드 관련 HTTP 요청 예제
  - `post.http`: 게시물 관련 HTTP 요청 예제

- **prisma/**: Prisma 설정 및 데이터베이스 스키마 정의
  - `schema.prisma`: Prisma 스키마 정의 파일
  - `seed.js`: 초기 데이터베이스 시드 파일
  - `updateMoment.js`: 특정 날짜로 게시물의 moment 필드를 업데이트하는 스크립트
  - `migrations/`: 데이터베이스 마이그레이션 파일들

- **public/**: 공개된 정적 파일들
  - `images/`: 이미지 파일들

- **src/**: 주요 소스 코드 디렉토리
  - `app.js`: Express 애플리케이션 설정
  - `controllers/`: 각종 컨트롤러 파일들
    - `commentController.js`: 댓글 관련 로직
    - `groupController.js`: 그룹 관련 로직
    - `imageController.js`: 이미지 업로드 관련 로직
    - `postController.js`: 게시물 관련 로직
  - `middlewares/`: 미들웨어 파일들
    - `auth.js`: 인증 미들웨어 (구현 필요)
  - `routes/`: 라우터 파일들
    - `badgeRoutes.js`: 배지 관련 라우터
    - `commentRoutes.js`: 댓글 관련 라우터
    - `groupRoutes.js`: 그룹 관련 라우터
    - `imageRoutes.js`: 이미지 업로드 관련 라우터
    - `postCommentRoutes.js`: 게시물 댓글 관련 라우터
    - `postRoutes.js`: 게시물 관련 라우터
  - `services/`: 서비스 파일들
    - `badgeService.js`: 배지 계산 로직
  - `utils/`: 유틸리티 파일들
    - `hashUtils.js`: 비밀번호 해시 유틸리티

- **uploads/**: 업로드된 파일들 저장 디렉토리
- **vercel.json**: Vercel 배포 설정 파일
- **package.json**: 프로젝트 설정 및 의존성 관리 파일
- **replit.nix**: Replit 환경 설정 파일
- **replit.toml**: Replit 실행 설정 파일

## 시작하기

### 로컬 개발 환경 설정

1. 저장소를 클론합니다:
   ```sh
   git clone https://github.com/your-username/jogakzip-api.git
   cd jogakzip-api
   ```

2. 필요한 패키지를 설치합니다:
   ```sh
   npm install
   ```

3. 데이터베이스를 설정합니다:
   ```sh
   npx prisma migrate dev
   ```

4. 서버를 시작합니다:
   ```sh
   npm run dev
   ```

## 배포

이 프로젝트는 Vercel을 사용하여 배포할 수 있습니다. `vercel.json` 파일을 참고하여 설정을 진행하세요.

## 기여하기

기여를 원하시면, 이슈를 생성하거나 풀 리퀘스트를 제출해 주세요.

## 라이선스

이 프로젝트는 ISC 라이선스 하에 배포됩니다.

