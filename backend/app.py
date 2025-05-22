from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import sys
import multiprocessing
import time
from Program import main


# 👇 Move this OUTSIDE the function
class NameData(BaseModel):
    name: str

def create_app():
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"]
    )

    @app.get("/api/ping")
    def say_hello(name: str = Query(...)):
        main.main(name)
        print(f"Received name: {name}")
        return {"message": f"App is ready!"}
    
    @app.get("/api/submit_number")
    def say_hello(name: str = Query(...)):
        main.main(name)
        print(f"Received name: {name}")
        return {"message": f"Dodano: {name}!"}

    
    @app.get("/api/orders")
    def say_hello(name: str = Query(...)):
        if not name.strip():
            raise HTTPException(status_code=400, detail="Name cannot be empty")
        main.set_oerder_path(name)
        print(f"Received name: {name}")
        return {"message": f"Path: {name}!"}

    @app.get("/api/calculation")
    def say_hello(name: str = Query(...)):
        if not name.strip():
            raise HTTPException(status_code=400, detail="Name cannot be empty")

        main.set_calculaion_path(name)
        print(f"Received name: {name}")
        return {"message": f"Path2: {name}!"}
    
    @app.get("/api/number_elem")
    def say_hello(name: str = Query(...)):
        if not name.strip():
            raise HTTPException(status_code=400, detail="Name cannot be empty")
        
        main.set_number_of_elem(name)
        
        return {"message": f"Liczba wyników: {name}!"}


    
    
    @app.get("/api/openExcel1")
    def open_Excel1():
        main.open_Excel_calculation()

    @app.get("/api/openExcel2")
    def open_Excel2():
        main.open_Excel_orders()

    @app.get("/api/new_Excel")
    def open_Excel3():
        main.copy_template()



       
    @app.get("/api/Orders_dialog")
    def open_Excel3():
        main.dialog_orders()
       
    @app.get("/api/Folder_dialog")
    def open_Excel3():
        main.dialog_folder()
       



        
    return app



def run_uvicorn():
    print("Running Uvicorn...")
    uvicorn.run(create_app(), host="127.0.0.1", port=8000, log_config=None)

def run():
    server = multiprocessing.Process(target=run_uvicorn)
    server.start()

    try:
        while True:
            time.sleep(1)
    except (KeyboardInterrupt, SystemExit):
        print("Shutting down backend...")
        server.terminate()
        server.join()

if __name__ == "__main__" or getattr(sys, 'frozen', False):
    multiprocessing.freeze_support()  
    run()
