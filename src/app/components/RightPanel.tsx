import places from "../data/Places_response.json";

type Props = {};

function RightPanel({}: Props) {

  return (
    <div className="w-64">
        <h1 className="m-2">Кількість будівель</h1>
      {Object.entries(places.results).map(([key, value]) => (
        <div
          className="bg-gray-300 p-2 rounded-md w-full flex item mb-4"
          key={key}
        >
          <div key={key} className="flex justify-between w-full items-center">
            <h2>{key}</h2>
            <div>Count: {value.count}</div>
          </div>
          {/* <div className="">
            <h3>Places:</h3>
            <ul className="list-disc list-inside">
                {value.items.map((place: any, index: number) => (
                <li key={index}>
                    <div className="flex flex-col">
                    <span>{place.name}</span>
                    </div>
                </li>
                ))}
            </ul>
            </div> */}
        </div>
      ))}
    </div>
  );
}

export default RightPanel;
