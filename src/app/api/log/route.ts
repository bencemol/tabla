import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  console.log(data);
  return new Response(null, {
    status: 200,
    statusText: "Ok",
  });
}
