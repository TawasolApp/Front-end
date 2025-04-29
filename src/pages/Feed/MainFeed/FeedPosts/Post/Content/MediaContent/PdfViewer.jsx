
const PdfViewer = ({ url }) => {
  console.log(`https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(url)}`.replace(".pdf", ""));
  return (
    <iframe
      title="GoogleDrivePDFViewer"
      src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(url)}`.replace(".pdf", "")}
      width="100%"
      height="100%"
      className="border-none w-full h-full"
    />
  );
};

export default PdfViewer;
