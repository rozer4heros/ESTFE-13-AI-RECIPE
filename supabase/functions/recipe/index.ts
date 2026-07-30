// Supabase 클라이언트 생성하기

// 환경변수 가져오기

// CORS 설정하기

// JSON 응답 함수 만들기
function jsonResponse(body:unknown, status=200){
  return new Response()
}

Deno.serve(async (req)=>{
  // 1. CORS 사전 요청 처리

  // 2. POST 요청인지 확인

  // 3. 필수 환경변수 확인

  // 4. 요청 본문에서 요리명 가져오기

  // 5. 요리명 입력값 검증

  // 6. Supabase 클라이언트 생성
  
  // 7. OpenAI API로 레시피 생성

  // 8. 레시피 생성 오류 확인

  // 9. OpenAI API로 음식 이미지 생성

  // 10. 이미지 생성 오류 확인

  // 11. 이미지 데이터를 저장 가능한 형태로 변환

  // 12. 레시피와 이미지 정보를 데이터베이스에 저장

  // 13. 데이터베이스 저장 오류 확인

  // 14. 생성 결과를 프론트엔드에 반환

  // 15. 
})
