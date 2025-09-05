import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Zod schema for form validation
const UserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(128, "Name must be at most 128 characters"),
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters").max(64, "Password must be at most 64 characters"),
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

  // Disable the submit button if any field is empty or the form is submitting
  const isDisabled = !name || !email || !password || form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof UserSchema>) {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-sm mx-auto mt-10"
        >
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your name" />
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
                  <Input {...field} placeholder="your@email.com" type="email" />
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
                  <Input {...field} placeholder="******" type="password" />
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
  );
}