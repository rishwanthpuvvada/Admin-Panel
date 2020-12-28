$(document).ready(() => {
    var url = 'http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D';    ;
    var tableData;
    const dataPromise = new Promise((resolve, reject) => {
      $.get(url, (data) => {
        resolve(data);
      }).fail((err) => {
        reject(new Error(`call failed with status ${err.status}`));
      });
    });
    dataPromise
      .then((list) => {
        tableData = list;
        list.map((data, pos) => {
          rowCreation(data, pos);
        });
      })
      .catch((error) => {
        console.log("call failed");
        console.log(`catch error => `, error);
      });
    rowCreation = (row, pos) => {
      $("#table-data > table > tbody").append(
        $("<tr>")
          .attr({
            class: "data-row",
            id: `row${pos}`,
          })
          .append(
            $("<td>").attr("class", "coumn1").text(row.id),
            $("<td>").attr("class", "coumn2").text(row.firstName),
            $("<td>").attr("class", "coumn3").text(row.lastName),
            $("<td>").attr("class", "coumn4").text(row.email),
            $("<td>").attr("class", "coumn5").text(row.phone)
          )
      );
      $(`#row${pos}`).click(() => {
        $(`.data-row`).removeClass("active");
        $(`#row${pos}`).addClass("active");
        $(`#info-content`).show();
        $(`#info-content > div:first-of-type`).html(
          `<b>User selected:</b> ${row.firstName} ${row.lastName}`
        );
        $(`#info-content > div:nth-of-type(2) textarea`).html(row.description);
        $(`#info-content > div:nth-of-type(3)`).html(
          `<b>Address:</b> ${row.address.streetAddress}`
        );
        $(`#info-content > div:nth-of-type(4)`).html(
          `<b>City:</b> ${row.address.city}`
        );
        $(`#info-content > div:nth-of-type(5)`).html(
          `<b>State:</b> ${row.address.state}`
        );
        $(`#info-content > div:nth-of-type(6)`).html(
          `<b>Zip:</b> ${row.address.zip}`
        );
      });
    };
    $(`form`).submit((e) => {
      e.preventDefault();
    });
    var search = document.getElementById("search-box");
    search.addEventListener("keyup", function () {
      $("#table-data > table > tbody").html("");
      if (search.value == "") {
        tableData.map((data, pos) => {
          rowCreation(data, pos);
        });
      } else {
        for (var i = 0; i < tableData.length; ++i) {
          //objects copy references so cloning is done instead of assigning
          var tdataString = JSON.stringify(tableData[i]);
          var tdata = JSON.parse(tdataString);
          var addressRemove = "address";
          var descRemove = "description";
          for (let key in tdata) {
            delete tdata[addressRemove];
            delete tdata[descRemove];
            if (
              tdata[key]
                .toString()
                .toLowerCase()
                .indexOf(search.value.toLowerCase()) > -1
            ) {
              rowCreation(tableData[i], i);
              break;
            }
          }
        }
      }
    });
  });