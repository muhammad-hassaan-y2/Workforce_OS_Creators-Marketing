from setuptools import setup, find_packages

setup(
    name="kaiso-cli",
    version="0.2.0",
    description="Kaiso — Autonomous AI Agent Operating System & Harness CLI for Sales, Marketing & Content Creators",
    author="Muhammad Hassaan",
    author_email="mr.hassaan50@gmail.com",
    url="https://github.com/muhammad-hassaan-y2/Workforce_OS_Creators-Marketing",
    packages=find_packages(),
    py_modules=["cli_harness"],
    install_requires=[
        "boto3>=1.28.0",
        "requests>=2.28.0",
        "python-dotenv>=1.0.0",
        "pydantic>=2.0.0",
        "fastapi>=0.100.0",
        "uvicorn>=0.22.0",
        "sqlalchemy>=2.0.0",
    ],
    entry_points={
        "console_scripts": [
            "kaiso=cli_harness:main",
        ],
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.8",
)
