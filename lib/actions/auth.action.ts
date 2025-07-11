"use server";

import { auth, db } from "@/firebase/admin";
import { signOut } from "firebase/auth";
import { cookies } from "next/headers";

const oneWeek = 60 * 60 * 24 * 7 * 1000;

export const signUp = async ({ uid, name, email }: SignUpParams) => {
  try {
    const userDocRef = db.collection("users").doc(uid);
    const userSnapshot = await userDocRef.get();

    if (userSnapshot.exists) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    await userDocRef.set({
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: "Account Created",
    };
  } catch (error: any) {
    console.error("Sign-up error:", error);

    // Handle specific Firestore or Auth errors (expand as needed)
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use.",
      };
    }

    return {
      success: false,
      message: error?.message || "Something went wrong.",
    };
  }
};

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;
  try {
    //
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "user does not exist",
      };
    }
    await setSessionCookie(idToken);
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err,
    };
  }
}
export async function handleLogout() {
  const cookieStore = cookies(); // cookies() is synchronous
  cookieStore.delete("session");
  console.log("Session cookie cleared. User logged out.");
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: oneWeek,
  });
  cookieStore.set("session", sessionCookie, {
    maxAge: oneWeek,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;
  try {
    const decodeClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db.collection("users").doc(decodeClaims.uid).get();
    if (!userRecord.exists) return null;
    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
