import IllustrationImage from "@/assets/login_illustration.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import SpendlyLogo from "/spendly_blacktext.svg";

// Zod schema
const LoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const email = form.watch("email");
  const password = form.watch("password");
  const isDisabled = !email || !password || form.formState.isSubmitting;
  const [showPass, setShowPass] = useState(false);

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email: values.email, password: values.password },
        { withCredentials: true }
      );
      console.log(res.data);
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.status === 400) {
        alert("Invalid email or password");
      } else {
        alert("Login failed. Please try again.");
      }
      console.error(err.response?.data || err.message);
    }
  }

  return (
    <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl shadow-lg p-0">
      <CardContent className="p-3">
        <div className="flex justify-between">
          <div className="flex flex-col w-full mx-15 my-3 justify-start">
            <img src={SpendlyLogo} className="logo w-35" alt="Spendly" />
            <div className="my-5">
              <h1 className="text-lg font-medium">Welcome Back!</h1>
              <p className="text-xs text-muted-foreground">
                Let's track your spending today.
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="your@email.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPass ? "text" : "password"}
                            placeholder="******"
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowPass(!showPass)}
                          >
                            {showPass ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full mt-1"
                  disabled={isDisabled}
                >
                  {form.formState.isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
            <p className="text-center text-xs mt-2">
              Don’t have an account?{" "}
              <Link to="/register" className="font-medium">
                Register
              </Link>
            </p>
          </div>
          <img
            src={IllustrationImage}
            alt="Illustration"
            className="h-115 rounded-md"
          />
        </div>
      </CardContent>
    </Card>
  );
}
