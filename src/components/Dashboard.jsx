import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { storage, db } from "../firebase";

function Dashboard() {
  const [file, setFile] = useState(null);

  const upload = async () => {
    if (!file) return alert("Please select a file first!");

    const storagePath = `images/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, storagePath);

    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "photos"), {
        url,
        storagePath,
        createdAt: new Date(),
      });

      alert("Uploaded!");
      setFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload.");
    }
  };

  return (
    <div className="p-6 text-center">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button
        onClick={upload}
        className="bg-green-600 p-2 rounded ml-2 text-white hover:bg-green-700"
      >
        Upload
      </button>
    </div>
  );
}

export default Dashboard;
