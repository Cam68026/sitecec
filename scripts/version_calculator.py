import subprocess

def get_commits():
    """Récupère les commits en ignorant ceux marqués [skip-version]."""
    result = subprocess.run(
        ["git", "log", "--pretty=%s"],
        text=True,
        capture_output=True
    )
    commits = result.stdout.split("\n")
    return [c for c in commits if "[skip-version]" not in c]

def calculate_version(commits):
    """Calcule la version sous le format 2.YYY.ZZZ."""
    major = 2
    minor = sum(1 for c in commits if "[feature]" in c)
    patch = len(commits) - minor
    return f"{major}.{minor:03d}.{patch:03d}"

if __name__ == "__main__":
    commits = get_commits()
    version = calculate_version(commits)
    print(f"Version générée : {version}")

    # Écrire la version dans version.txt
    with open("version.txt", "w") as f:
        f.write(version)
