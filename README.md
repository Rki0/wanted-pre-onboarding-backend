# 원티드 프리온보딩 인턴십 백엔드 과제 README

## 지원자 성명

박기영

## AWS 환경 세팅

<img width="638" alt="스크린샷 2023-08-06 오후 5 12 50" src="https://github.com/lordmyshepherd-edu/wanted-pre-onboardung-backend-selection-assignment/assets/86224851/e4dfca4c-fb98-42fa-a6b4-7a5e2560704d">

프론트엔드는 구현 대상이 아니기 때문에 `postman`을 사용해서 요청을 전송합니다.  
`AWS EC2`를 사용하여 `express`로 구현한 서버 코드를 배포했습니다.  
`AWS RDS`를 사용하여 `MySQL`을 연결하였습니다.  
`EC2`와 `RDS`를 연동하였으며,  
유저(`postman`)는 `EC2`와, `EC2`는 `RDS`와 데이터를 주고받습니다.

## 배포 API 주소

http://ec2-43-201-78-36.ap-northeast-2.compute.amazonaws.com:8080

## 애플리케이션의 실행 방법 (엔드포인트 호출 방법 포함)

`postman`을 활용하여 API 통신을 진행합니다.  
앞서 명시한 배포 주소를 통해 엔드포인트로 접근할 수 있습니다.

```
http://ec2-43-201-78-36.ap-northeast-2.compute.amazonaws.com:8080/api/...
```

구현한 API 엔드포인트는 위와 같은 형식을 공통적으로 가지고 있으며,  
README 하단에 적혀있는 명세서를 통해 더 자세하게 확인 할 수 있습니다.

```
// 회원가입 API 호출 방법

http://ec2-43-201-78-36.ap-northeast-2.compute.amazonaws.com:8080/api/signup
```

`postman`에서 배포 주소와 엔드 포인트를 위 예시와 같이 사용하실 수 있습니다.

## 데이터베이스 테이블 구조

<img width="654" alt="스크린샷 2023-08-05 오후 4 11 47" src="https://github.com/Rki0/wanted-pre-onboarding-backend/assets/86224851/fd45f2bb-26d6-4a5f-acf8-7ce00afd5784">

`PK`로 사용되는 `id`의 경우 클라이언트 쪽에 직접 전달하는 것은 좋지 않다고 판단하여,  
`uuid`를 사용하여 또 하나의 식별자를 사용합니다.  
따라서 `PK`는 내부적으로, `uuid`는 외부적으로 사용됩니다.  
단, 게시물의 경우 생성, 수정, 삭제에 대하여 권한 체크를 진행하며, 민감한 정보가 없기 때문에  
`PK`로 사용되는 `id`를 내외부적으로 모두 사용합니다.

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

3. 로그인 시, `jsonwebtoken`을 사용하여 1시간동안 유효한 JWT를 발행합니다. JWT에는 user의 userId, email 값이 들어가며, 이는 미들웨어를 통해 디코딩하여 접근 권한 판별에 활용합니다.

### 게시물

1. 게시물 생성, 수정, 삭제 API를 사용할 경우, `middlewares/auth.js`를 통해 JWT를 디코딩하고 유효성 검증 및 존재하는 유저인지 검증 후 접근을 허가합니다.

- 게시물 수정 API의 경우 사용자는 title만 입력할 수도, description만 입력할 수도 있기에 이를 반영하여 입력된 값만 수정이 되도록 했습니다.

- JWT는 요청을 보낼 때 `headers`의 `Authorization` key에 담아서 보내면 됩니다. 이 때 `"Bearer 발급받은_JWT"` 형식으로 입력해야합니다.

2. 게시물 목록 조회 API의 경우, pagination을 적용했으며 페이지 당 3개의 게시물을 반환하도록 했습니다. 게시물은 생성된 순서대로 나열됩니다.

## API 명세(request/response 포함)

### 회원 가입(`POST`, `/api/user/signup`)

> request

```json
{
  "email": "wanted@wanted.com",
  "password": "test1234"
}
```

> response

```json
{
  "message": "회원가입 성공."
}
```

### 로그인(`POST`, `api/user/login`)

> request

```json
{
  "email": "wanted@wanted.com",
  "password": "test1234"
}
```

> response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNjkxMjAwMTE2LCJleHAiOjE2OTEyMDM3MTZ9.niNni2bSocc938rAzKbF6QmCTpYW92x8MdBHE8mxrRY"
}
```

### 게시물 생성(`POST`, `api/post`)

> headers

```json
{
  // ... //
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNjkxMjAwMTE2LCJleHAiOjE2OTEyMDM3MTZ9.niNni2bSocc938rAzKbF6QmCTpYW92x8MdBHE8mxrRY"
}
```

> request

모든 프로퍼티는 1자 이상 입력해야합니다.  
`title`의 경우 최대 255자까지 입력 가능합니다.

```json
{
  "title": "hi",
  "description": "It's me!"
}
```

> response

```json
{
  "message": "게시물이 등록되었습니다."
}
```

### 게시물 삭제(`DELETE`, `api/post/:postId`)

> headers

```json
{
  // ... //
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNjkxMjAwMTE2LCJleHAiOjE2OTEyMDM3MTZ9.niNni2bSocc938rAzKbF6QmCTpYW92x8MdBHE8mxrRY"
}
```

> request

데이터를 body에 담을 필요가 없습니다.  
삭제할 게시물 아이디를 API 경로에 파라미터로 입력해주세요.

> response

```json
{
  "message": "게시물이 삭제되었습니다."
}
```

### 게시물 수정(`PATCH`, `api/post/:postId`)

> headers

```json
{
  // ... //
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNjkxMjAwMTE2LCJleHAiOjE2OTEyMDM3MTZ9.niNni2bSocc938rAzKbF6QmCTpYW92x8MdBHE8mxrRY"
}
```

> request

`title` 혹은 `description`을 입력할 수 있습니다.  
수정을 원치 않는 프로퍼티는 빈 문자열을 보내거나, 아예 입력하지 않으셔도 됩니다.  
입력되지 않은 프로퍼티는 수정되지 않고, 기존의 값을 유지합니다.  
`title`의 경우 최대 255자까지 입력 가능합니다.

```json
// title만 수정하는 경우 1
{
  "title": "Change title",
  "description": ""
}

// title만 수정하는 경우 2
{
  "title": "Change title",
}


// description만 수정하는 경우
{
  "title": "",
  "description": "Change description"
}

// 둘 다 수정하는 경우
{
  "title": "Change title",
  "description": "Change description"
}
```

> response

```json
{
  "message": "게시물 수정 완료."
}
```

### 게시물 목록 조회(`GET`, `api/post/posts?page=${pageNumber}`)

> request

데이터를 body에 담을 필요가 없습니다.  
조회하고자 하는 페이지를 API 경로에 쿼리 스트링으로 입력해주세요.  
페이지 당 3개의 게시물이 조회됩니다.

```js
// 1 page를 조회하고자 하는 경우

api/post/posts?page=1
```

> response

```json
{
  "count": 8, // 총 게시물 개수
  "totalPages": 3, // 산출된 총 페이지 개수
  "currentPage": 1, // 현재 페이지. 쿼리 스트링으로 입력한 값.
  "posts": [
    {
      "id": 1,
      "title": "hi",
      "description": "It's me!",
      "createdAt": "2023-08-05T03:02:29.000Z",
      "updatedAt": "2023-08-05T03:02:29.000Z",
      "user": {
        "email": "hi@hi.com"
      }
    },
    {
      "id": 2,
      "title": "hi2",
      "description": "It's me!2",
      "createdAt": "2023-08-05T03:02:41.000Z",
      "updatedAt": "2023-08-05T03:02:41.000Z",
      "user": {
        "email": "hi@hi.com"
      }
    },
    {
      "id": 3,
      "title": "hi3",
      "description": "It's me!24",
      "createdAt": "2023-08-05T03:02:45.000Z",
      "updatedAt": "2023-08-05T03:02:45.000Z",
      "user": {
        "email": "hi@hi.com"
      }
    }
  ]
}
```

### 특정 게시물 조회(`GET`, `api/post/:postId`)

> request

데이터를 body에 담을 필요가 없습니다.  
조회할 게시물 아이디를 API 경로에 파라미터로 입력해주세요.

> response

```json
{
  "post": {
    "title": "hi",
    "description": "It's me!",
    "author": "hi@hi.com"
  }
}
```
