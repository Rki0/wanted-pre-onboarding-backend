# 원티드 프리온보딩 인턴십 백엔드 과제 README

## 지원자의 성명

박기영

## 애플리케이션의 실행 방법 (엔드포인트 호출 방법 포함)

`npm install` 실행 전 `.env` 파일 추가 필요(README 하단에 설정값 첨부)

```
$ git clone https://github.com/Rki0/wanted-pre-onboarding-backend.git
$ cd wanted-pre-onboarding-backend
$ npm install
$ npm start
```

## 데이터베이스 테이블 구조

<img width="638" alt="스크린샷 2023-08-05 오전 9 45 55" src="https://github.com/Rki0/wanted-pre-onboarding-backend/assets/86224851/5ea01729-051a-47c2-b956-141cb2477acf">

## 구현한 API의 동작을 촬영한 데모 영상 링크

## 구현 방법 및 이유에 대한 간략한 설명

- `Sequelize`를 사용하여 SQL 쿼리를 보다 더 빠르게 작성할 수 있도록 했습니다.
- `utils/database.js`에서 MySQL과 Seqeulize를 연동합니다.
- `controllers`에서 req,res에 대한 로직을 처리합니다.
- `users` 테이블과 `posts` 테이블은 관계가 연결되어있으며, `user` 삭제 시 `post`도 함께 삭제되도록 했습니다.

### 사용자

1. `express-validator`를 사용하여 이메일과 비밀번호 유효성을 검증했습니다.

- 이메일의 경우, 요구 조건이었던 "@" 포함 외에도 ".com"과 같은 기본적인 이메일 구성 요소도 판별해야했기 때문에 라이브러리를 활용하는 것을 선택했습니다.

2. `bcrypt`를 사용하여 비밀번호를 암호화하여 저장했습니다.

3. 로그인 시, `jsonwebtoken`을 사용하여 1시간동안 유효한 JWT를 발행합니다. JWT에는 user의 id, email 값이 들어가며, 이는 미들웨어를 통해 디코딩하여 접근 권한 판별에 활용합니다.

### 게시물

1. 게시물 생성, 수정, 삭제 API를 사용할 경우, `middlewares/auth.js`를 통해 JWT를 디코딩하고 유효성 검증 및 존재하는 유저인지 검증 후 접근을 허가합니다.

- 게시물 수정 API의 경우 사용자는 title만 입력할 수도, description만 입력할 수도 있기에 이를 반영하여 입력된 값만 수정이 되도록 했습니다.

2. 게시물 목록 조회 API의 경우, pagination을 적용했으며 페이지 당 3개의 게시물을 반환하도록 했습니다. 게시물은 생성된 순서대로 나열됩니다.

## API 명세(request/response 포함)

### 회원 가입

- `POST`
- `/api/user/signup`

- `req`

```json
{
  "email": "wanted@wanted.com",
  "password": "test1234"
}
```

```json
{
  "message": "회원가입 성공."
}
```

## `.env` 파일 설정
