export function bfs (
  root, 
  getNeighbors = () => {}, 
  isValid = () => {}, 
  getKey = o => o.toString()
) {
  let visited = {};
  let queue = [root];
  let hits = [];
  function visit(node) {
    visited[getKey(node)] = true;
  }
  function isVisited(node) {
    return visited[getKey(node)];
  }
  while(queue.length) {
    let toCheck = queue.shift();
    if (!isVisited(toCheck) && isValid(toCheck)) {
      hits.push(toCheck);
      queue.push(...getNeighbors(toCheck));
    }
    visit(toCheck);
  }
  return hits;
}


