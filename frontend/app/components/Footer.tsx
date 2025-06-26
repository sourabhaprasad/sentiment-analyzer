export default function Footer() {
  return (
    <footer className="bg-gray-900 backdrop-blur-md text-center text-sm py-4 text-white">
      © {new Date().getFullYear()} Movie Sentiment Analyzer
    </footer>
  );
}
