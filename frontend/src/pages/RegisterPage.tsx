import illustrationImage from "@/assets/login_illustration.png";
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

// Zod schema for form validation
const UserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(128, "Name must be at most 128 characters"),
  email: z.email(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(64, "Password must be at most 64 characters"),
});

export default function RegisterPage() {
  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Watch form values for button state
  const name = form.watch("name");
  const email = form.watch("email");
  const password = form.watch("password");
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  // Disable the submit button if any field is empty or the form is submitting
  const isDisabled =
    !name || !email || !password || form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof UserSchema>) {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
      });
      console.log(res.data);
      navigate("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.status === 400) {
        alert("Email already in use");
        return;
      }
      alert("Registration failed. Please try again.");
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
              <h1 className="text-lg font-medium">Welcome to Spendly!</h1>
              <p className="text-xs text-muted-foreground">
                Join now and take control of your spending.
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="What should we call you?"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <Button type="submit" className="w-full" disabled={isDisabled}>
                  {form.formState.isSubmitting ? "Registering..." : "Register"}
                </Button>
              </form>
            </Form>
            <p className="text-center text-xs mt-2">
              Have an account?{" "}
              <Link to="/login" className="font-medium">
                Login
              </Link>
            </p>
          </div>
          <img
            src={illustrationImage}
            alt="Illustration"
            className="h-115 rounded-md"
          />
        </div>
      </CardContent>
    </Card>
  );
}
