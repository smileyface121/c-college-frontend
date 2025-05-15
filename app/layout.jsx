
export const metadata = {
  title: 'Celcor College Quiz',
  description: 'Thermodynamics quiz frontend',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        {children}
      </body>
    </html>
  );
}
