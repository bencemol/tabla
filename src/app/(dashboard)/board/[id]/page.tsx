import { Metadata } from "next";

type BoardProps = {
  params: {
    id: string;
  };
};

export function generateMetadata({ params }: BoardProps): Metadata {
  return {
    title: `Board ${params.id}`,
  };
}

export default function Board({ params }: BoardProps) {
  return <div>board {params.id}</div>;
}
