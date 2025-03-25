document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("github-form");
    const searchInput = document.getElementById("search");
    const userList = document.getElementById("user-list");
    const repoList = document.getElementById("repos-list");
    const toggleSearchBtn = document.getElementById("toggle-search");
    let searchType = "users"; // Toggle between "users" and "repos"

    toggleSearchBtn.addEventListener("click", () => {
        searchType = searchType === "users" ? "repos" : "users";
        toggleSearchBtn.textContent = `Search Type: ${searchType.toUpperCase()}`;
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (!query) return;
        
        if (searchType === "users") {
            searchUsers(query);
        } else {
            searchRepositories(query);
        }
    });

    function searchUsers(query) {
        fetch(`https://api.github.com/search/users?q=${query}`, {
            headers: { Accept: "application/vnd.github.v3+json" }
        })
        .then(response => response.json())
        .then(data => displayUsers(data.items))
        .catch(error => console.error("Error fetching users:", error));
    }

    function displayUsers(users) {
        userList.innerHTML = "";
        repoList.innerHTML = "";
        users.forEach(user => {
            const li = document.createElement("li");
            li.innerHTML = `
                <img src="${user.avatar_url}" width="50" height="50" alt="Avatar">
                <a href="${user.html_url}" target="_blank">${user.login}</a>
                <button data-username="${user.login}">View Repos</button>
            `;
            li.querySelector("button").addEventListener("click", () => fetchRepos(user.login));
            userList.appendChild(li);
        });
    }

    function fetchRepos(username) {
        fetch(`https://api.github.com/users/${username}/repos`, {
            headers: { Accept: "application/vnd.github.v3+json" }
        })
        .then(response => response.json())
        .then(data => displayRepos(data))
        .catch(error => console.error("Error fetching repos:", error));
    }

    function displayRepos(repos) {
        repoList.innerHTML = "";
        repos.forEach(repo => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
            repoList.appendChild(li);
        });
    }

    function searchRepositories(query) {
        fetch(`https://api.github.com/search/repositories?q=${query}`, {
            headers: { Accept: "application/vnd.github.v3+json" }
        })
        .then(response => response.json())
        .then(data => displayRepos(data.items))
        .catch(error => console.error("Error fetching repositories:", error));
    }
});
