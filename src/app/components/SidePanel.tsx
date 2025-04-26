import TimeLineSelector from "./TimeLineSelector";

type Props = {};

function SidePanel({}: Props) {
  return (
    <div className=" z-50 h-full bg-amber-50 w-64">
      SidePanel
      <TimeLineSelector />
    </div>
  );
}

export default SidePanel;
