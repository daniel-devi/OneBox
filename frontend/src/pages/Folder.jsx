import Navbar from "../components/Navbar";
import MyFolder from "../components/folder/MyFolder";
export default function Folder() {
  return (
    <div>
      <Navbar folder={"folder"} dashboard={"dashboard"} />
      <h2>Folder Page</h2>
      <Folder />
    </div>
  );
}
