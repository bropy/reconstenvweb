import TimeLineSelector from "./TimeLineSelector";

type Props = {};

function LeftPanel({}: Props) {
  return (
    <div className=" z-50 h-full bg-amber-50 w-72">
      
      <TimeLineSelector />
    </div>
  );
}

export default LeftPanel;
