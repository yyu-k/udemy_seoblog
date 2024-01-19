import { ContactForm } from "@/components/form/ContactForm";

export default async function Page({params}) {
    return (
      <>
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <h2>
                        Contact Form
                    </h2>
                    <ContactForm/>
                </div>
            </div>
        </div>
      </>
    )
  }