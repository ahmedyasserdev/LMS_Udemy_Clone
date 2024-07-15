"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "../db";
import Stripe from "stripe";
import { stripe } from "../stripe"; // Ensure you are correctly importing the stripe instance

export const purchaseTheCourse = async (courseId: string) => {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      throw new Error("Unauthorized");
    }

    const courseToPurchase = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    if (!courseToPurchase) throw new Error("Course Not Found");

    const isPurchased = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          courseId,
          userId: user.id,
        },
      },
    });

    if (isPurchased) throw new Error("Already Purchased");

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: courseToPurchase.title,
            description: courseToPurchase.description!,
          },
          unit_amount: Math.round(courseToPurchase.price! * 100),
        },
      },
    ];

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!stripeCustomer) {
      const newCustomer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });

      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: newCustomer.id,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseToPurchase.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseToPurchase.id}?canceled=1`,
      metadata: {
        courseId: courseToPurchase.id,
        userId: user.id,
      },
    });

    return { url: session.url };
  } catch (error) {
    console.log("[PURCHASING_COURSE]", error);
    throw error; 
  }
};
