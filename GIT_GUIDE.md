# Git Workflow Guide: Samson Dental Center

This guide outlines the standard workflow for staying up to date with the original repository, managing your fork, and contributing changes.

## 1. Understanding the Remotes

Your local repository is connected to two main sources on GitHub:
- **`origin`**: Your personal fork (`https://github.com/christineocomen/SamsonDentalCenter`)
- **`upstream`**: The original repository (`https://github.com/ChrstprJohn/SamsonDentalCenter`)

You can verify these by running:
```powershell
git remote -v
```

---

## 2. Getting the Latest Changes

### From the Initial Source (`upstream`)
If the original project has new updates and you want them in your local code:
1. **Fetch the updates:**
   ```powershell
   git fetch upstream
   ```
2. **Merge them into your current branch (usually main):**
   ```powershell
   git pull upstream main
   ```

### From Your Fork (`origin`)
If you "Synced" your fork on the GitHub website and want those changes locally:
```powershell
git pull origin main
```

---

## 3. Working on `main` and Pushing

### Staying on `main`
If you are working directly on the `main` branch:
1. **Make your changes** locally.
2. **Stage and commit** your changes:
   ```powershell
   git add .
   git commit -m "Your descriptive commit message"
   ```
3. **Push to your fork:**
   ```powershell
   git push origin main
   ```

---

## 4. Creating a Pull Request (PR)

To contribute your changes back to the original project:

1. **Push your changes** to your fork (`origin`) as shown above.
2. **Go to GitHub**: Visit [your fork](https://github.com/christineocomen/SamsonDentalCenter) or the [original repo](https://github.com/ChrstprJohn/SamsonDentalCenter).
3. **Open PR**: GitHub will usually show a yellow bar saying "This branch is X commits ahead... Contribute -> Open Pull Request".
4. **Compare & Create**: Ensure the "base repository" is `ChrstprJohn/SamsonDentalCenter` and the "head repository" is your fork.
5. **Submit**: Write a title and description, then click **Create pull request**.

---

## 5. Quick Troubleshooting

- **Merge Conflicts**: If `git pull` shows conflicts, open the files, look for `<<<<<<< HEAD`, resolve the differences, then run:
  ```powershell
  git add .
  git commit -m "Resolve merge conflicts"
  ```
- **Wrong Remote Name**: If you get "fatal: 'upsteam' does not appear to be a git repository", remember it is spelled **`upstream`** (with an 'r').
