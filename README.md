# 사다리타기

그록봇 아이콘과 함께하는 사다리타기 웹 게임입니다.

- 인원 2~10명
- 위에는 이름, 아래에는 상·벌
- 주사위 후 사다리 무작위 배정
- 세팅값 5칸, 지난 기록은 브라우저에 저장

## 실행

```bash
npm install
npm run dev
```

브라우저에서 표시된 주소로 열면 됩니다.

## 공개 배포

[사다리타기 플레이](https://kimjubo.github.io/jubo-tools/games/ladder/)

GitHub Pages용 정적 빌드: `npm run build:pages`. 결과는 `dist-pages/`에 생성된다. 기존 서버용 설정은 유지한다. 세팅과 기록은 같은 브라우저에 저장된다.
