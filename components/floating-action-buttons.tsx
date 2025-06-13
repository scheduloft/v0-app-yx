const FloatingActionButtons = () => {
  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end space-y-2">
      {/* Add your floating action buttons here */}
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Button 1</button>
      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">Button 2</button>
    </div>
  )
}

export default FloatingActionButtons
