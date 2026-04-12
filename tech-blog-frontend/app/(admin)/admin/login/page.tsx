export default function AdminLogin() {
  return (
    <div>
      <h1>Admin Login</h1>

      <form style={{ marginTop: "20px" }}>
        <div>
          <label>Email</label><br />
          <input type="email" placeholder="admin@email.com" />
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Password</label><br />
          <input type="password" placeholder="********" />
        </div>

        <button style={{ marginTop: "15px" }}>
          Login
        </button>
      </form>
    </div>
  );
}