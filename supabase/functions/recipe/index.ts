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
        const body = await req.json();
        const title = body?.title?.trim();

        // 5. 요리명 입력값 검증
        if (!title) {
          return jsonResponse({ error: "" }, 400);
        }

        // 6. 관리자 권한 Supabase 클라이언트 가져오기
        const admin = ctx.supabaseAdmin;

        // 7. OpenAI API로 레시피 생성
        const completionConfig = {
          model: "gpt-4o-mini",
          messages: [{
            role: "system",
            content:
              "당신은 한국어 요리 레시피 비서입니다. 2인분 기준으로 재료, 조리 단계, 시간, 팁을 간결하게 작성하세요.",
          }, {
            role: "user",
            content: `요리명: ${title}`,
          }],
          temperature: 0.7,
        };

        const chatResponse = await fetch(
          "https://api.openai.com/v1/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(completionConfig),
          },
        );
        const chatJson = await chatResponse.json();

        // 8. 레시피 생성 오류 확인
        if (!chatResponse.ok) {
          return jsonResponse(
            {
              error: "Creating OpenAI recipe failed",
              status: chatResponse.status,
              detail: chatJson?.error?.message ??
                "Creating OpenAI recipe failed",
            },
            chatResponse.status,
          );
        }

        // 9. 생성된 레시피 내용 가져오기
        const recipe = chatJson?.choices?.[0]?.message?.content ?? "";

        // 10. OpenAI API로 음식 이미지 생성
        const imageResponse = await fetch(
          "https://api.openai.com/v1/images/generations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-image-2",
              prompt:
                `${title}의 고화질 음식 사진, 자연광, 음식 잡지 스타일, 심플한 배경`,
              size: "1024x1024",
              quality: "low",
              output_format: "png",
            }),
          },
        );
        const imageJson = await imageResponse.json();

        // 11. 이미지 생성 오류 확인
        if (!imageResponse.ok) {
          return jsonResponse(
            {
              error: "Creating OpenAI image failed",
              status: imageResponse.status,
              detail: imageJson?.error?.message ??
                "Creating OpenAI image failed",
            },
            imageResponse.status,
          );
        }

        // 12. 이미지 데이터를 저장 가능한 형태로 변환
        const imageBase64 = imageJson?.data?.[0]?.b64_json ?? null;
        if (!imageBase64) {
          return jsonResponse({
            error: "Image data missing",
            detail: "No created image data",
          }, 500);
        }
        const image_url = imageBase64
          ? `data:image/png;base64,${imageBase64}`
          : null;

        // 13. Storage에 저장할 이미지 경로 생성

        // 14. 생성된 이미지를 Supabase Storage에 업로드

        // 15. Storage 업로드 오류 확인

        // 16. 업로드된 이미지의 공개 URL 생성

        // 17. 레시피와 이미지 정보를 데이터베이스에 저장
        // const { error: insertError } = await admin.from("recipes").insert({
        // title,
        // recipe,
        // image_url,
        // });

        // 18. 데이터베이스 저장 오류 확인
        // if (insertError) {
        return jsonResponse({
          error: "Database insert failed",
        });
        // }

        // 19. 생성 결과를 프론트엔드에 반환
        return jsonResponse({
          title, // 요리명
          recipe, // 조리법
          image_url, //썸네일 이미지
        });
      } catch (error) {
        console.error(error);
        return jsonResponse({
          error: `Server error`,
          detail: error instanceof Error ? error.message : String(error),
        }, 500);
      }
    },
  ),
};
