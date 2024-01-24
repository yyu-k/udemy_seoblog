'use client'
import { useState, useEffect } from "react";
import { signup } from "@/actions/auth";

export default function Page({params}) {

  return (
      <>
      <div className="container">
        <h2>Account Activation</h2>
        <hr/>
        {params.activationjwt}
      </div>
      </>
    )
  }