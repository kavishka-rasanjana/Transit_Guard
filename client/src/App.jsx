import ViolationForm from './ViolationForm';

function App() {
  return (
    // CSS CLASSES EXPLAINED:
    // 1. min-vh-100: Sets the minimum height to 100% of the viewport (Full screen height)
    // 2. w-100: Sets the width to 100% to ensure the background covers everything
    // 3. d-flex: Enables Flexbox layout
    // 4. justify-content-center: Centers the content horizontally (Left to Right)
    // 5. align-items-center: Centers the content vertically (Top to Bottom)
    // 6. bg-light: Adds a light gray background color for better contrast
    <div className="min-vh-100 w-100 d-flex justify-content-center align-items-center bg-light">
      
      {/* The Container component handles responsive width and spacing (margins/padding) */}
      <div className="container">
        <ViolationForm />
      </div>

    </div>
  );
}

export default App;