import { requestForm } from '@/api/ADempiere/dictionary'
import { showMessage } from '@/utils/ADempiere/notification'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import router from '@/router'
import language from '@/lang'

const form = {
  state: {
    form: []
  },
  mutations: {
    addForm(state, payload) {
      state.form.push(payload)
    },
    dictionaryResetCacheForm(state) {
      state.form = []
    },
    changeFormAttribute(state, payload) {
      let value = payload.attributeValue
      if (payload.attributeNameControl) {
        value = payload.form[payload.attributeNameControl]
      }
      payload.form[payload.attributeName] = value
    }
  },
  actions: {
    getFormFromServer({ commit, dispatch }, {
      id,
      containerUuid,
      routeToDelete
    }) {
      return new Promise(resolve => {
        requestForm({
          uuid: containerUuid,
          id
        })
          .then(formResponse => {
            const panelType = 'form'

            // Panel for save on store
            const newForm = {
              ...formResponse,
              containerUuid,
              fieldList: [],
              panelType
            }

            commit('addForm', newForm)
            // dispatch('addPanel', newForm)

            resolve(newForm)

            // Convert from gRPC process list
            const actions = []

            // Add process menu
            dispatch('setContextMenu', {
              containerUuid,
              actions
            })
          })
          .catch(error => {
            router.push({ path: '/dashboard' })
            dispatch('tagsView/delView', routeToDelete)
            showMessage({
              message: language.t('login.unexpectedError'),
              type: 'error'
            })
            console.warn(`Dictionary form - Error ${error.code}: ${error.message}.`)
          })
      })
    },
    changeFormAttribute({ commit, getters }, {
      containerUuid,
      form,
      attributeName,
      attributeNameControl,
      attributeValue
    }) {
      if (isEmptyValue(form)) {
        form = getters.getForm(containerUuid)
      }
      commit('changeFormAttribute', {
        form,
        attributeName,
        attributeValue,
        attributeNameControl
      })
    }
  },
  getters: {
    getForm: (state) => (formUuid) => {
      return state.form.find(
        item => item.uuid === formUuid
      )
    }
  }
}

export default form
