"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import Formfield from "./Formfield";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { signUp, signIn } from "@/lib/actions/auth.action";

//
const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};
const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });
        if (!result?.success) {
          toast.error(result?.message);
          return;
        }
        toast.success("Account Created");
        router.push("/sign-in");
      } else {
        const { email, password } = values;
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("something went wrong try again");
          return;
        }

        await signIn({
          email,
          idToken,
        });
        toast.success("Signned In");
        router.push("/");
      }
    } catch (err: any) {
      console.error("Auth error:", err);

      // Optional: handle Firebase auth errors more clearly
      if (err.code === "auth/email-already-in-use") {
        toast.error("This email is already registered.");
      } else if (err.code === "auth/invalid-credential") {
        toast.error("Invalid credentials. Please check email or password.");
      } else if (err.code === "auth/user-not-found") {
        toast.error("User not found. Please sign up.");
      } else if (err.code === "auth/wrong-password") {
        toast.error("Incorrect password. Try again.");
      } else {
        toast.error(err?.message || "Something went wrong. Try again.");
      }
    }
  }

  const isSignin = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 py-14 px-6">
        <div className="flex flex-row gap-2 justify-center">
          <Image width={32} height={32} src="/logo.svg" alt="" />
          <h2 className="text-primary-400">Interview Prep</h2>
        </div>
        <h3>Practice Job Interview with Ai</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignin && (
              <Formfield
                control={form.control}
                name="name"
                label="name"
                placeholder="Name"
              />
            )}
            <Formfield
              control={form.control}
              name="email"
              label="Email"
              placeholder="Email"
              type="email"
            />
            <Formfield
              control={form.control}
              name="password"
              label="password"
              placeholder="Password"
              type="password"
            />
            <Button className="btn mt-2" type="submit">
              {isSignin ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignin ? "No Account? " : "Having an Account! "}
          <Link href={!isSignin ? "/sign-in" : "/sign-up"}>
            {!isSignin ? "Sign in" : "Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
