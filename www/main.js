
let identityEntrypoint = "https://identity.api.rackspacecloud.com/v2.0/tokens";

async function main() {

  // Load username and api key from local server
  let {username, apiKey} = await fetch("/config.json").then(res => res.json());

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

  console.log(access);
  let endpoint;
  let token = access.token.id;
  for (let entry of access.serviceCatalog) {
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


  let name = "rackspace.monitoring.entities.en4PbkCx7B.checks.remote.http.chVsFUAGMr.mzord.bytes";

  // let query = "/metrics/search?query=rackspace.monitoring.entities.*.byte*";
  //
  //
  // let results = await fetch("/proxy/" + url + query, opts)
  //   .then(res => res.json());
  //
  // console.log(results);
  //
  // let name = results[3].metric;

  let extra = "?from=" + (Date.now() - 1000*60*60*24*7) +
              "&to=" + Date.now() +
              "&points=168";

  let data = await fetch("/proxy/" + url + "/views/" + name + extra, opts)
    .then(res => res.json());

  console.log(data);


}

main().catch(console.error);
