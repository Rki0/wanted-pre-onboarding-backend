# 구현해야할 것

## 회원가입[v]

1. 비밀번호 암호화 및 8자 이상[v]
2. 이메일 @ 포함[v]

## 로그인

1. JWT 생성[v]
2. 비밀번호 암호화 및 8자 이상[v]
3. 이메일 @ 포함[v]
4. 일치하는지 검사[v]

## 게시판

- 게시물 생성[v]

1. 반드시 이메일(로그인) 필요[v]

- 게시판 조회 Pagination[v]

- 특정 게시물 조회[v]

1. 해당 게시글의 ID를 받아서 조회[v]

- 특정 게시물 수정

1. 작성자만 가능

- 특정 게시글 삭제

1. 작성자만 가능

# 지원자의 성명

박기영

# 애플리케이션의 실행 방법 (엔드포인트 호출 방법 포함)

# 데이터베이스 테이블 구조

임시

> user
>
> - email - string : @ 포함
> - password - string : 8자 이상, 암호화
>   createdAt
>   updatedAt

> post
>
> - title - string
> - description - string
> - createdAt
> - updatedAt
> - images - ?

# 구현한 API의 동작을 촬영한 데모 영상 링크

# 구현 방법 및 이유에 대한 간략한 설명

# API 명세(request/response 포함)
