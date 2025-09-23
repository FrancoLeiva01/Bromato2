"use client"

import type React from "react"
import { useState } from "react"
import { X, ChevronDown, FileText, Building, AlertTriangle, FileCheck} from "lucide-react"

interface TutorialModalProps {
  isVisible: boolean
  onClose: () => void
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isVisible, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedPersonType, setSelectedPersonType] = useState("")
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false])

  if (!isVisible) return null

  const markStepComplete = (stepIndex: number) => {
    const newCompletedSteps = [...completedSteps]
    newCompletedSteps[stepIndex] = true
    setCompletedSteps(newCompletedSteps)
  }

  const tutorialSteps = [
    {
      title: "Crear notificaciones",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">?</span>
              </div>
              <span className="font-medium text-gray-900">¿Cómo creo Notificaciones??</span>
            </div>
          </div>

          <div className="pl-4">
            <h4 className="font-semibold text-gray-900 mb-3">Pasos a seguir:</h4>
            <ol className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="bg-blue-600 text-white rounded-full w-10 h-5 flex items-center justify-center text-xs font-semibold mt-0.5">
                  1
                </span>
                <span>Para crear notificaciones tiene que hacerlo desde la tabla de acta de inspección, seleccionando al acta de inspección la cual cuenta con notificación.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="bg-blue-600 text-white rounded-full w-8 h-5 flex items-center justify-center text-xs font-semibold mt-0.5">
                  2
                </span>
                <span>Recorda que podes cargar mas de una notificación en el acta si corresponden al mismo día de la inspección.</span>
              </li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      title: "Crear Actas de inspección",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedPersonType === "humana" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => {
                setSelectedPersonType("humana")
                markStepComplete(1)
              }}
            >
              <div className="flex items-center space-x-3">
                <FileCheck className="w-10 h-6 text-gray-600" />
                <div>
                  <h5 className="font-semibold text-gray-900">Para crear Actas de Inspección tienes que hacerlo desde la tabla de comercios</h5>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedPersonType === "juridica"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => {
                setSelectedPersonType("juridica")
                markStepComplete(1)
              }}
            >
              <div className="flex items-center space-x-3">
                <Building className="w-6 h-6 text-gray-600" />
                <div>
                  <h5 className="font-semibold text-gray-900">Selecciona el comercio en el cual se realizo la inspección.</h5>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">💡</span> Recorda que a cada comercio pueden agregarse la cantidad de actas de inspección que se realizan sin volver a crearlo.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Crear Comercios",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center space-x-3">
              <FileText className="w-10 h-6 text-gray-600" />
              <span className="font-medium text-gray-900">Para crear comercios tienes que hacerlo desde la pestaña precargados , seleccionando la pestaña comercios y dando al boton "Nuevo Comercio"</span>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Guía rápida</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Guía Rápida del Sistema</h3>
            <p className="text-gray-600">Resuelve tus dudas sobre los procesos de la pagina municipal de Bromatologia</p>
          </div>

          <div className="space-y-6">
            {tutorialSteps.map((step, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div
                  className={`p-4 cursor-pointer transition-colors ${
                    currentStep === index ? "bg-blue-50 border-b border-gray-200" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setCurrentStep(currentStep === index ? -1 : index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full flex items-center justify-center text-sm font-semibold bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{step.title}</h4>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        currentStep === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {currentStep === index && <div className="p-4 border-t border-gray-200">{step.content}</div>}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorialModal
