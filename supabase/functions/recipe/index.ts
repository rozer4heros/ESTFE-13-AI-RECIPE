import { withSupabase } from "npm:@supabase/server@^1";

// 환경변수 가져오기
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

// JSON 응답 함수 만들기
function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export default {
  fetch: withSupabase(
    { auth: "publishable" },
    async (req, ctx) => {
      // 1. CORS 사전 요청 처리
      // withSupabase가 OPTIONS 요청과 CORS 헤더를 자동으로 처리

      // 2. POST 요청인지 확인
      if (req.method !== "POST") {
        return jsonResponse({ error: "Method not allowed." }, 405);
      }

      try {
        // 3. 필수 환경변수 확인
        if (!OPENAI_API_KEY) {
          return jsonResponse({ error: "Missing environment variable" }, 500);
        }

        // 4. 요청 본문에서 요리명 가져오기

        // 5. 요리명 입력값 검증

        // 6. 관리자 권한 Supabase 클라이언트 가져오기

        // 7. OpenAI API로 레시피 생성

        // 8. 레시피 생성 오류 확인

        // 9. 생성된 레시피 내용 가져오기

        // 10. OpenAI API로 음식 이미지 생성

        // 11. 이미지 생성 오류 확인

        // 12. 이미지 데이터를 저장 가능한 형태로 변환

        // 13. Storage에 저장할 이미지 경로 생성

        // 14. 생성된 이미지를 Supabase Storage에 업로드

        // 15. Storage 업로드 오류 확인

        // 16. 업로드된 이미지의 공개 URL 생성

        // 17. 레시피와 이미지 정보를 데이터베이스에 저장

        // 18. 데이터베이스 저장 오류 확인

        // 19. 생성 결과를 프론트엔드에 반환
        return jsonResponse({
          message: "레시피 엣지 함수", //요리명, 조리법, 썸네일 이미지
        });
      } catch (error) {
        console.error(error);
        return jsonResponse({ error: `Server error: ${error}` }, 500);
      }
    },
  ),
};
