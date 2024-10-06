import { BiShareAlt } from "react-icons/bi";
import Player from "./components/Player";

const App = () => {
  const songs = [
    {
      id: "1",
      title: "Silver linings",
      artist: "Zicr",
      image:
        "https://c.saavncdn.com/194/Silver-Linings-Hindi-2023-20240105104754-150x150.jpg",
      url: "https://aac.saavncdn.com/746/cd42ad2a46ab58addbe9049dc6768d32_320.mp4",
    },
    {
      id: "2",
      title: "Silver lings 2",
      artist: "Silvber",
      image:
        "https://c.saavncdn.com/194/Silver-Linings-Hindi-2023-20240105104754-150x150.jpg",
      url: "https://aac.saavncdn.com/194/3fc1c8cc8e5817e87c816e700c9cb47c_320.mp4",
    },
  ];

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="player w-full px-4">
        <Player
          songs={songs}
          options={{
            autoplay: true,
            loop: true,
          }}
          customComponent={
            <div>
              <BiShareAlt size={30} />
            </div>
          }
        />
      </div>
    </main>
  );
};

export default App;
