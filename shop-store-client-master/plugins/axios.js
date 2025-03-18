export default function ({$axios, redirect, error}) {
  $axios.onRequest(config => {
    console.log("Making request to " + config.url);
  });
  $axios.onResponse(response => {
    console.log(response.data);
  });
}
