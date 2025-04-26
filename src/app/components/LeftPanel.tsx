import TimeLineSelector from "./TimeLineSelector";

type Props = {};

function LeftPanel({}: Props) {
  return (
    <div className=" z-50 h-full bg-amber-50 w-64">
      SidePanel
      <TimeLineSelector />
    </div>
  );
}

export default LeftPanel;
