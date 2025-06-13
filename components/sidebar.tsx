import { Link } from "react-router-dom"

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Invoices", path: "/invoices" },
    { name: "Payments", path: "/payments" },
    { name: "Settings", path: "/settings" },
  ]

  return (
    <div className="sidebar">
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
      {/* rest of code here */}
    </div>
  )
}

export default Sidebar
