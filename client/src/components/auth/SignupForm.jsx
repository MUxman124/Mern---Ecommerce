import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import axios from 'axios'
  
export function SignupForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/register', formData)
      console.log("hello")
      localStorage.setItem('token', response.data.token)
      navigate('/dashboard')
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message)
      } else {
        setError('An error occurred')
      }
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an Account</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your information to create an account</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="space-y-2">
          <Input
            id="name"
            placeholder="Full Name"
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Input
            id="email"
            placeholder="Email"
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Input
            id="password"
            placeholder="Password"
            required
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <Button className="w-full" type="submit">
          Sign Up
        </Button>
      </form>
      <div className="text-center text-sm">
        Already have an account?{' '}
        <Button variant="link" onClick={() => navigate('/login')}>
          Login
        </Button>
      </div>
    </div>
  )
}

