import Navbar from "../components/Navbar";
import MyFolder from "../components/folder/MyFolder";
export default function Folder() {
  return (
    <div>
      <Navbar folder={"folder"} dashboard={"dashboard"} />
      <MyFolder />
    </div>
  );
}
