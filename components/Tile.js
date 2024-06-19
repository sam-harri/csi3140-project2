import { useEffect, useState } from "react";

const Tile = ({
  letter,
  evaluation,
}) => {
  let bgColor;
  switch (evaluation) {
    case "absent":
      bgColor = "bg-gray-400";
      break;
    case "present":
      bgColor = "bg-yellow-500";
      break;
    case "correct":
      bgColor = "bg-green-500";
      break;
    default:
      bgColor = "";
  }

  let borderColor = "border-gray-300";
  if (letter) borderColor = "border-[#878A8C]";


  const [evalClass, setEvalClass] = useState("not-evaluated");

  return (
    <>
      <div
        className={`tile ${evalClass} text-[32px] font-bold uppercase`}
      >
        <div className="tile-inner">
          <div
            className={`tile-front flex h-[58px] w-[58px] items-center justify-center border-2 ${borderColor} text-black ${bgColor}`}
          >
            {letter}
          </div>
        </div>
      </div>
    </>
  );
};

export default Tile;
