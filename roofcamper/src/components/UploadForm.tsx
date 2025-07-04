"use client"; // 👈 tells Next.js this is a client component

import { useState } from "react";

export default function UploadForm() {

    const [file, setFile] = useState<File | null>(null);
    //current selected file, if nothing then null otherwise shows file (setfile once changed)
    const [title, setTitle] = useState("");
    //current title of the file. without anything just leave it empty

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
    };
    //handle file change, e -> react.changeevent takes html input and sets selectedfile to the first file in e.target.files? (uploaded files), setFile set to be the selectedFile or nun

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent default form page refresh
    if (!file) {
        alert("Please select an image to upload.");
        return;
    }

    const formData = new FormData();
    //FormData is empty object to begin with
    formData.append("file", file);
    formData.append("title", title);

    const res = await fetch("/api/upload", {
        method: "POST",
        //send to the server to create new resource
        body: formData,
    });

    if (!res.ok) {
        alert("Upload failed");
    } else {
        alert("Upload successful!");
    }

    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />

            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Optional title"
                className="w-full border rounded px-3 py-2"
            />

            <button
                type="submit"
                className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
            >
                Upload
            </button>
        </form>
    );
}
