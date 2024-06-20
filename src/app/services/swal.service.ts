import { Injectable } from "@angular/core";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class SwalService {
  constructor() {}

  showSuccess(message: string) {
    Swal.fire("Success", message, "success");
  }

  showError(message: string) {
    Swal.fire("Error", message, "error");
  }

  showWarning(message: string) {
    Swal.fire("Warning", message, "warning");
  }

  showInfo(message: string) {
    Swal.fire("Info", message, "info");
  }

  showConfirm(message: string): Promise<any> {
    return Swal.fire({
      title: "Are you sure?",
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });
  }
  // confirmBox() {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#DD6B55",
  //     confirmButtonText: "Yes, submit it!",
  //     cancelButtonText: "Cancel",
  //   }).then((result) => {
  //     console.log("success", result);
  //     if (result.isConfirmed) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });
  // }

  // In your service
  confirmBox(message: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        text: message,
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, submit it!",
        cancelButtonText: "Cancel",
      }).then((result) => {
        console.log("success", result);
        if (result.isConfirmed) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
}

// import { Component } from "@angular/core";
// import { SwalService } from "./swal.service";

// @Component({
//   selector: "app-root",
//   templateUrl: "./app.component.html",
//   styleUrls: ["./app.component.css"],
// })
// export class AppComponent {
//   title = "sweetalert-demo";

//   constructor(private swalService: SwalService) {}

//   showSuccess() {
//     this.swalService.showSuccess("This is a success message!");
//   }

//   showError() {
//     this.swalService.showError("This is an error message!");
//   }

//   showWarning() {
//     this.swalService.showWarning("This is a warning message!");
//   }

//   showInfo() {
//     this.swalService.showInfo("This is an info message!");
//   }

//   showConfirm() {
//     this.swalService
//       .showConfirm("Do you want to delete this?")
//       .then((result) => {
//         if (result.isConfirmed) {
//           this.swalService.showSuccess("Deleted successfully!");
//         } else if (result.dismiss === Swal.DismissReason.cancel) {
//           this.swalService.showInfo("Cancelled");
//         }
//       });
//   }
// }
