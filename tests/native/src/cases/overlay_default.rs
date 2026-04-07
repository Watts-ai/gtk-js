use relm4::prelude::*;

pub struct OverlayDefault;

#[relm4::component(pub)]
impl SimpleComponent for OverlayDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Overlay {
            set_child: Some(&gtk::Label::new(Some("Content"))),
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
