$(document).ready(function () {
  var accessToken =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2RldmhybS5lYXR0ZW5kYW5jZS5jb20vYXBpL2xvZ2luIiwiaWF0IjoxNzE2MTA3MDgxLCJleHAiOjE3MTYxMTA2ODEsIm5iZiI6MTcxNjEwNzA4MSwianRpIjoicFNTMkszcTBtYnB0bXNuaiIsInN1YiI6IjE2MzkiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.hlt3ff5Cx7a-WNhWm-LQ_p9tU7nhCcpWP1XJF7Yp07E";

  $("#example").DataTable({
    ajax: {
      url: "https://devhrm.eattendance.com/api/tasks",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    },

    columns: [
      { data: "id" },
      {
        data: "title",
        render: function (data) {
          return `<span data-bs-toggle="tooltip" data-bs-placement="top" title="${data}">${data}</span>`;
        },
      },

      {
        data: "Attachment",
        render: function (data, type, row) {
          if (data && data.length > 0) {
            var attachmentsCount = data.length;
            var counter = `<span class="counter">${attachmentsCount}</span>`;
            var attachmentHtml = `<div class="align-center"><div class="circle-button " >`;

            data.forEach(function (attachment) {
              var fileType = attachment.split(".").pop().toLowerCase();
              var fancyboxType = fileType === "pdf" ? "pdf" : "image";
              attachmentHtml +=
                '<a data-fancybox="gallery" data-type="' +
                fancyboxType +
                '" href="' +
                attachment +
                '">';
            });
            attachmentHtml +=
              '<i class="las la-file-alt"></i>' + counter + "</a></div></div>";
            return attachmentHtml;
          } else {
            return ""; // No attachments, return empty string
          }
        },
      },

      // {
      //   data: "Attachment",
      //   render: function (data, type, row) {
      //     if (data && data.length > 0) {
      //       var attachmentsCount = data.length;
      //       var attachmentIcon = '<i class="las la-file-alt"></i>';
      //       var counter =
      //         '<span class="counter">' + attachmentsCount + "</span>";
      //       var attachmentLinks = data
      //         .map(function (attachment) {
      //           var fileType = attachment.split(".").pop().toLowerCase();
      //           var fancyboxType = fileType === "pdf" ? "pdf" : "image";
      //           return (
      //             '<a data-fancybox="gallery" data-type="' +
      //             fancyboxType +
      //             '" data-src="' +
      //             attachment +
      //             '" href="javascript:;"></a>"'
      //           );
      //         })
      //         .join("");
      //       var attachmentHtml =
      //         '<div class="circle-button">' +
      //         attachmentIcon +
      //         " " +
      //         counter +
      //         attachmentLinks +
      //         "</div>";
      //       return attachmentHtml;
      //     } else {
      //       return ""; // No attachments, return empty string
      //     }
      //   },
      // },
      {
        data: "status",
        render: function (data) {
          // var badgeClass = "";
          // switch (data) {
          //   case "Ongoing":
          //     badgeClass = "bg-warning ";
          //     break;
          //   case "Pending":
          //     badgeClass = "bg-danger";
          //     break;
          //   default:
          //     badgeClass = "bg-secondary";
          // }
          var status = `<span id="status-badge" class="badge rounded-pill ${data.bg_color}">${data.title}</span>`;
          return status;
        },
      },
      {
        data: "Comment",
        render: function (data, type, row) {
          var commentIcon = `<span class="comment"><i class="las la-comments"></i></span>`;
          var commentHtml = `<div class="align-center"><div class="circle-button" data-bs-toggle="modal" data-bs-target="#comment" data-row='${JSON.stringify(
            row
          )}'>${commentIcon}</div></div>`;
          return commentHtml;
        },
      },
    ],
  });

  // Handle click event on comment icons
  $("#example").on(
    "click",
    '.circle-button[data-bs-toggle="modal"]',
    function () {
      var rowData = $(this).data("row");

      $("#issue_head").empty().append(`
              <h5 >
              Issue: ${rowData.title}
            </h5>
      `);

      var badgeClass = "";
      switch (rowData.Status) {
        case "Ongoing":
          badgeClass = "bg-warning ";
          break;
        case "Pending":
          badgeClass = "bg-danger";
          break;
        default:
          badgeClass = "bg-secondary";
      }

      $("#comment_form").empty().append(`
      <div class="row">
       
          <span> ${rowData.id}</span>
        
          
          <p>Description: ${rowData.title}</p>
        
          <p>Attachments: ${rowData.Attachment || "No Attachment"}</p>
        
         <p>Status:
        <span id="status-badge" class="badge rounded-pill ${
          rowData.status.bg_color
        }">${rowData.status.title}</span></p>
         
      </div>
    `);

      $("#comment_list").empty().append(`
              <p>Comment: ${rowData.Comment.map(
                (comment_item) =>
                  `<div class="comment-item">${comment_item}</div>`
              ).join("")}</p>
      `);
    }
  );

  Fancybox.bind("[data-fancybox]", {
    Toolbar: {
      enabled: true,
      display: {
        left: ["infobar"],
        middle: [],
        right: ["download", "thumbs", "close"],
      },
    },
  });

  // Initialize tooltips
  $('[data-toggle="tooltip"]').tooltip();

  $("#addIssueForm").submit(function (event) {
    event.preventDefault();
    var formData = new FormData(this);
    $.ajax({
      type: "POST",
      url: "https://example.com/api/add-issue", // Replace with your API endpoint
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      data: formData,
      contentType: false,
      processData: false,
      success: function (data) {
        console.log("Issue added successfully!");
        // Refresh the DataTable
        $("#example").DataTable().ajax.reload();
      },
      error: function (xhr, status, error) {
        console.log("Error adding issue:", error);
      },
    });
  });

  //date picker
  $("#showFormButton").click(function () {
    var now = new Date();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var today = now.getFullYear() + "-" + month + "-" + day;

    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    var time = hours + ":" + minutes + ":" + seconds;

    var currenttime = today + " " + time;

    $("#datePicker").val(currenttime);
  });
});
