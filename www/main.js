
let identityEntrypoint = "https://identity.api.rackspacecloud.com/v2.0/tokens";

async function main() {

  // Load username and api key from local server
  let {username, apiKey} = await fetch("/config.json").then(res => res.json());

  document.querySelector("#username-menu").textContent = `Account: ${username}`;
  let auth = localStorage.getItem(username);
  if (auth) {
    auth = JSON.parse(auth);
  }
  else {
    // Load service catalog from identity.
    let {access} = await fetch("/proxy/" + identityEntrypoint, {
      mode: "cors",
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        auth: { "RAX-KSKEY:apiKeyCredentials": {
          username: username,
          apiKey: apiKey
        }}
      })
    }).then(res => res.json());
    localStorage.setItem(username, JSON.stringify(access));
    auth = access;
  }

  console.log(auth);
  let endpoint;
  let token = auth.token.id;
  for (let entry of auth.serviceCatalog) {
    if (entry.name === "cloudMetrics") {
      endpoint = entry.endpoints[0];
      break;
    }
  }
  let url = endpoint.publicURL;
  console.log(endpoint, token);

  let opts = {
    mode: "cors",
    method: "GET",
    headers: {
      "Accept": "application/json",
      "X-Auth-Token": token
    }
  };

  // let query = "/metrics/search?query=rackspace.monitoring.entities.*remote.http*";
  // let results = await fetch("/proxy/" + url + query, opts)
  //   .then(res => res.json());
  // console.log(results);
  // console.log(results[3]);
  //
  // let name = results[3].metric;

  let entityName = "Luvit.io";
  let entity = "en4PbkCx7B";
  let check = "chJKDWhbAK";
  let zones = ["dfw","lon","ord"];
  let graphs = {
    duration: "Duration (ms)",
    tt_firstbyte: "Time to First Byte (ms)",
  }

  for (let graph in graphs) {
    let rows = [];
    for (let zone of zones) {
      let name = `rackspace.monitoring.entities.${entity}.checks.remote.http.${check}.mz${zone}.${graph}`;
      console.log(name);
      let extra = "?from=" + (Date.now() - 1000*60*60*24) +
                  "&to=" + Date.now() +
                  "&points=1440";
      let result = await fetch("/proxy/" + url + "/views/" + name + extra, opts)
        .then(res => res.json());
      console.log(result);
      rows.push({
        label: zone.toUpperCase(),
        data: result
      });
    }

    console.log(rows);

    var chart = new CanvasJS.Chart(`${graph}-container`, {
  		title:{
  			text: `Luvit.io - ${graphs[graph]}`
  		},
  		data: rows.map(row => ({
        type: "line",
        dataPoints: row.data.values.map(point => ({
          x: new Date(point.timestamp),
          y: point.average
        }))
      }))
  	});
  	chart.render();
  }



}

main().catch(console.error);
